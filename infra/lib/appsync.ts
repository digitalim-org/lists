import { join as pathJoin } from "path";
import { Stack, StackProps, Construct, RemovalPolicy } from "@aws-cdk/core";
import {
  GraphqlApi,
  Schema,
  AuthorizationType,
  MappingTemplate,
  PrimaryKey,
  Values,
} from "@aws-cdk/aws-appsync";
import { Table, AttributeType } from "@aws-cdk/aws-dynamodb";
import { APP_NAME } from "../config";
import { UserPool } from "@aws-cdk/aws-cognito";

type AppSyncStackProps = StackProps & {
  userPool: UserPool;
};

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

    const todosTable = new Table(this, `${APP_NAME}-DynamoDBTodos`, {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "createdAt",
        type: AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const itemsTable = new Table(this, `${APP_NAME}-DynamoDBItems`, {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const todosDataSource = api.addDynamoDbDataSource(
      "TodosDataSource",
      todosTable
    );
    const itemsDataSource = api.addDynamoDbDataSource(
      "ItemsDataSource",
      itemsTable
    );

    todosDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "addTodo",
      requestMappingTemplate: MappingTemplate.dynamoDbPutItem(
        PrimaryKey.partition("id").auto(),
        Values.projecting("input")
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });

    itemsDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "addItem",
      requestMappingTemplate: MappingTemplate.dynamoDbPutItem(
        PrimaryKey.partition("id")
          .auto()
          .sort("createdAt")
          .is(Date.now().toString()),
        Values.projecting("input")
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });

    todosDataSource.createResolver({
      typeName: "Query",
      fieldName: "getTodos",
      requestMappingTemplate: MappingTemplate.dynamoDbScanTable(),
      responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
    });

    itemsDataSource.createResolver({
      typeName: "Query",
      fieldName: "getItems",
      requestMappingTemplate: MappingTemplate.dynamoDbScanTable(),
      responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
    });
  }
}
