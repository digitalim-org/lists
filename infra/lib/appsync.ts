import { join as pathJoin } from "path";
import {
  Stack,
  StackProps,
  Construct,
  RemovalPolicy,
  CfnOutput,
} from "@aws-cdk/core";
import {
  GraphqlApi,
  Schema,
  AuthorizationType,
  MappingTemplate,
  PrimaryKey,
  Values,
  Directive,
  KeyCondition,
} from "@aws-cdk/aws-appsync";
import { Table, AttributeType } from "@aws-cdk/aws-dynamodb";
import { APP_NAME } from "../config";
import { UserPool } from "@aws-cdk/aws-cognito";

type AppSyncStackProps = StackProps & {
  userPool: UserPool;
};

const mappingTemplateDir = pathJoin(__dirname, "mappingTemplates");

export class AppSyncStack extends Stack {
  constructor(scope: Construct, id: string, props: AppSyncStackProps) {
    super(scope, id, props);

    const { userPool } = props;
    const api = new GraphqlApi(this, `${APP_NAME}-AppSyncGraphqlAPI`, {
      name: "todo",
      schema: Schema.fromAsset(pathJoin(__dirname, "schema.graphql")),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool,
          },
        },
      },
    });

    new CfnOutput(this, "apiEndpoint", { value: api.graphqlUrl });

    const todosTable = new Table(this, `${APP_NAME}-DynamoDBTodos`, {
      partitionKey: {
        name: "userID",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "itemID",
        type: AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // todosTable.addGlobalSecondaryIndex({
    //   indexName: "createdAtIdx",
    //   partitionKey: {
    //     name: "id",
    //     type: AttributeType.STRING,
    //   },
    //   sortKey: {
    //     name: "createdAt",
    //     type: AttributeType.NUMBER,
    //   },
    // });

    const todosDataSource = api.addDynamoDbDataSource(
      "TodosDataSource",
      todosTable
    );

    todosDataSource.createResolver({
      typeName: "Query",
      fieldName: "getTodos",
      requestMappingTemplate: MappingTemplate.fromFile(
        pathJoin(mappingTemplateDir, "getTodos.vtl")
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
    });

    todosDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "addTodo",
      requestMappingTemplate: MappingTemplate.fromFile(
        pathJoin(mappingTemplateDir, "addTodo.vtl")
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });

    todosDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "deleteTodo",
      requestMappingTemplate: MappingTemplate.fromFile(
        pathJoin(mappingTemplateDir, "deleteTodo.vtl")
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
    });
  }
}
